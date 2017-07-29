import re

import urllib
from urllib.parse import urlparse, urlunparse
from urllib.request import urlopen, Request
from google import search

import pluralize

"""
For every <thing> we will go to a page based on the top wikipedia google search
result.

Each <thing> looks for a list of <object>s

i.e.

find '<object> = Country|ies' '<thing> = Region|Arica'

therefore, the search: "list of countries Africa site:wikipedia.org"

At these pages, we look for a pattern. This patter should return many matches.
These are our pieces of data. The second pattern is applied to each piece of
data and two matches should be return. If the length of matches is > 3 (there
are more tban 2 matches) then we should raise that data piece for manual
inspection.

<thing>s Come from a source file. These could be generated from a generic beginning
like, continents in the world...
"""

# The below should all come from a custom script written for each data object
search_prefix = "Category:"
data_property = "Country"
preposition = "in"

split_1 = '<div\sclass="mw-category-group"><h3>A<\/h3>'
split_2 = '<\/ul><\/div><\/div><\/div>'
data_pattern = 'data-ct-title="(.*?)"'

search_prefix = "List_of_"
data_property = "city"
preposition = "in"

split_1 = '<table\sclass="wikitable\ssortable\scentre">.*<\/tr>'
split_2 = '</tr>\s</table>'
data_pattern = 'title="(*.?)">'

# Open source file
readfile = open('source_regions.txt', 'r')

for line in readfile:
    # Set the <thing>
    _prefix = search_prefix
    _object = line[:-1]
    _prep = "in"
    _property = pluralize.pluralize(data_property)

    search_term = "{}{}_{}_{}".format(_prefix, _property, _prep, _object)

    #results = search(search_term, stop=1)
    #result = (r for r in results)

    try:
        # the source
        source = "https://en.wikipedia.org/wiki/" + search_term
    except StopIteration as e:
        # no results
        # print some debug
        print("obj/prop {} {}".format(_object, _property))
        print("Search Term: {}".format(search_term))

        exit(1)
    else:
        print(source)

    request = Request(source, headers={"User-Agent": "pcooper-datascrape"})
    response = urlopen(request)
    content = response.read().decode('utf-8')

    ## Now we need a custom script for pulling out the data. In the example used
    ## countries of Africa, we need to pull each row as a data set.
    parts = re.split(split_1, content)

    data_actual = re.split(split_2, parts[1])[0]
    data_sets_pattern = re.compile(data_pattern, re.S | re.M)

    data_iter = data_sets_pattern.finditer( data_actual )

    with open('{}_{}.txt'.format(_property.lower(), _object), 'w') as writefile:
        for match in data_iter:
            try:
                writefile.write( match.group(1) + "\n" )
            except Exception as e:
                print(e)
                inp = input("Press enter to cont.")
                continue

    readfile.close()
    exit(1)

import re

import re

""" Useful script for importing certain data sets from wikipedia """
readfile = open('some_data.txt', 'r')
matches = []
reg = re.compile("^\*\s\[\[([^]]+)\]\].+\[\[([^]]+)\]\]")
split_on = "\|"
for line in readfile:
    m = reg.match(line)

    try:
        if m:
            # we'll assume there's two groups
            # otherwise it's a broken line
            country = re.split(split_on, m.group(1))
            capital = re.split(split_on, m.group(2))

            # create a new tuple with only the last name mentioned for
            # a country/city and that will the be most common (usually)
            matches.append( (country[len(country)-1], capital[len(capital)-1]) )

    except IndexError:
        print("Bad Line: " + line)

template = "<option value='{}'>{}</option>\n"

readfile.close()

# output
with open('output.txt', 'w') as writefile:
    for match in matches:
        writefile.write(template.format(match[0], match[1]))

with open('output_rev.txt', 'w') as writefile_rev:
    for match in matches:
        writefile_rev.write(template.format(match[1], match[0]))

import csv

def csvtostring():
    oriDoc = open("newData.csv", 'rt')
    reader = csv.reader(oriDoc)
    countryList = ""
    for row in reader:
        country_origin = row[0]
        countryList = countryList + ", " +country_origin
    print(countryList)

csvtostring()

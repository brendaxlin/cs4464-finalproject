import csv
import pprint

def csvReader():
    oriDoc = open("refugeedata.csv", 'rt')
    print("open doc")
    newDoc = open("refugee_converted.csv", 'w')
    reader = csv.reader(oriDoc)
    writer = csv.writer(newDoc)
    oldCountry = ""
    currentRow = 0
    countString = ""
    countNum = 0
    countList = []
    for row in reader:
        try:
            currentRow += 1
            country_refugee = row[0]
            country_origin = row[1]
            if country_refugee == oldCountry:
                countList.append(country_origin)
                countNum += int(row[3])
                print(oldCountry, country_origin)
            else:
                oldCountry = country_refugee
                countList.append(country_origin)
                for c in countList:
                    countString = countString + ", " + str(c)
                print(oldCountry,country_origin)
                writer.writerow([country_refugee, country_origin, countNum, countNum/8452457])
                countString = ""
                countNum = 0
                countList = []
        except:
            print(currentRow + "PLEASE ADD ERROR")
csvReader()

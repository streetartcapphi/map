#
#  Construction de vues derivees a partir des posts, 
#
#     ce script construit une liste de posts non valides
#



import json
import os
import os.path
import datetime

from os.path import join

print("Construction de la vue unvalidated")

# parcours des "inputs"

assert os.path.exists("locations/input")

validated = {}

weekdelta = datetime.timedelta(0,0,0,0,0,0,1)
monthdelta = datetime.timedelta(0,0,0,0,0,0,4)

by_week = []
by_month = []


for root, dirs, files in os.walk("locations/input"):
    for name in files:
       if not name[-8:0] == ".geojson":
          pass
       filepath = join(root,name)
       print "lecture " + filepath 
       f = open(filepath)
       content = f.read()
       o = json.loads(content)
       f.close()

       validated = reduce(lambda r,j:r and j['properties']['validated'],o['features'], True)
       mustbepublished = reduce(lambda r,j:r and j['properties']['mustbepublished'],o['features'], True)
       if mustbepublished and validated:
          sd = o["features"][0]['properties']['post_date']
          # parse date
          d = datetime.datetime.strptime(sd, "%Y-%m-%d %H:%M:%S" )
          nbweeks = int( (datetime.datetime.now() - d).total_seconds() / weekdelta.total_seconds())
          nbmonth = int( (datetime.datetime.now() - d).total_seconds() / monthdelta.total_seconds())

          while len(by_week) <= nbweeks:
             by_week.append([])
             print by_week
          l = by_week[nbweeks] 
          if not l:
             l = []
          l = l + o["features"]
          by_week[nbweeks] = l


          while len(by_month) <= nbmonth:
             by_month.append([])


          l = by_month[nbmonth] 
          if not l:
             l = []
          l = l + o["features"]
          by_month[nbmonth] = l


#merge feature and write view       

print json.dumps(by_month)
print json.dumps(by_week)

assert os.path.exists("locations/views")
basepath = "locations/views/bydate"
if not os.path.exists(basepath):
   os.mkdir(basepath)


def writeFiles(a,suffix):
   assert a != None
   for i in range(0,len(a)):
      foldername = str(i) + suffix
      folder = os.path.join(basepath, foldername)
      if not os.path.exists(folder):
         os.mkdir(folder)

      view = {
          "type":"FeatureCollection",
          "features":[]
      }
      view["features"] = view["features"] + a[i]

      f = open(os.path.join(folder,"content.geojson"), "w")
      f.write(json.dumps(view, indent=4))
      f.close();

print "writing weeks"
writeFiles(by_week, "weeks")
writeFiles(by_month, "months")

print("Done")



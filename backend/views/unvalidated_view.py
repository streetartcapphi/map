#
#  Construction de vues derivees a partir des posts, 
#
#     ce script construit une liste de posts non valides
#



import json
import os
import os.path

from os.path import join

print("Construction de la vue unvalidated")

# parcours des "inputs"

assert os.path.exists("locations/input")

unvalidated = {}

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

       validated = reduce(lambda r,j:r or j['properties']['validated'],o['features'], False)
       mustbepublished = reduce(lambda r,j:r or j['properties']['mustbepublished'],o['features'], False)
       if mustbepublished and not validated:
          unvalidated[filepath] = o

#merge feature and write view       

print json.dumps(unvalidated)

# add edit url 
for k,v in unvalidated.items():
   relativepath = k.split('/')
   relativepath = reduce(lambda s,o:s+"/"+o,relativepath[1:],"")
   for i in v['features']:
      i['properties']['editURL'] = "http://geojson.io/#id=github:streetartcapphi/locations/blob/master" + relativepath


view = {
    "type":"FeatureCollection",
    "features":[]
}


def add(v,o):
   v["features"].extend(o['features']) 
   return v

#write result
assert os.path.exists("locations/views")
if not os.path.exists("locations/views/unvalidated"):
   os.mkdir("locations/views/unvalidated")
   
f = open("locations/views/unvalidated/content.geojson", "w")
f.write(json.dumps(reduce(add , unvalidated.values(), view), indent=4))
f.close();

print("Done")



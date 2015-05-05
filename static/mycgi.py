#!/usr/bin/python

import cgitb
cgitb.enable()


import sys
import json
import cgi

sys.path.append('/home/mazab/public_html/salsa_efl/static/saLSa')

from newsalsa import Salsa

fs = cgi.FieldStorage()
#sys.stdout.write("Content-Type: application/json")

sentence = fs.getvalue('sentence')

word = fs.getvalue('word')
#sentence = fs.getvalue('sentence')


print 'Content-Type: application/json\n\n'

#sys.stdout.open()
#sys.stdout.write('Content-type: application/json\n')
#print 'Content-Type: text/html\n'

s = Salsa(word, sentence)
res = s.process()
#print res

result = {'result':res,'message':'The Command Completed Successfully'};


#print json.dumps(result)


#result = {'result':res}
#print result
#print(json.JSONEncoder().encode(result))

sys.stdout.write(json.dumps(result,indent=1))
sys.stdout.write("\n")
sys.stdout.close()

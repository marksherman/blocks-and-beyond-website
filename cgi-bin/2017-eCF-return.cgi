#!/usr/bin/env python2.7
# Python script for displaying information from HTTP request

import cgi, os
import cgitb; cgitb.enable()
import datetime
import json

outputdir = '/home/blocks-and-beyond/2017-log'

# Top-level dispatch for web page request from this site
def respondToPageRequest():

  # print "Welcome to the cgi-bin debugging page.<br>"
  # print "This page displays key-value pairs from the HTTP request, plus all environment variables.<br>"

  # Extract CGI form fields
  inputs = cgi.FieldStorage()

  sortedKeys = sorted(inputs.keys())
  timestamp = datetime.datetime.now()
  timestring = timestamp.strftime("%Y-%m-%d-%H-%M-%S-%f")
  inputDict = {key:inputs.getvalue(key) for key in sortedKeys}

  if sortedKeys == ['ArtId', 'CopyType']:
    artId = inputs.getvalue('ArtId')
    copyType = inputs.getvalue('CopyType')
    # HTML to appear in browser
    print '''<html>
       <p>Your IEEE electronic copyright form for submission {} has been
           sucessfully processed with copyright type {}</p>
       </html>'''.format(artId, copyType)
    # Write info to log file
    outFileName = 'paper{}_successfulCopyright__{}'.format(artId, timestring)
  else: 
    print '''<html>
      <p>The response from the IEEE copyright server contains unexpected keys: {}</p>
      </html>'''.format(sortedKeys)
    if 'ArtId' in sortedKeys:
      artId = inputs.getvalue('ArtId')
      outFileName = 'paper{}_unsuccessfulCopyright__{}'.format(artId, timestring)
    else:
      outFileName = 'unknownPaper_unsuccessfulCopyright__{}'.format(timestring)
  with open (os.path.join(outputdir, outFileName), 'w') as outFile:
    json.dump(inputDict,outFile)


# Guido's suggested method for CGI debugging 
def main():
  print "Content-Type: text/html\n"
  try:
    # Invoke the page request handler
    respondToPageRequest()
  except:
    print "<hr><h1>A Python Error occurred!</h1>"
    cgi.print_exception()

# Start the whole shebang
main()

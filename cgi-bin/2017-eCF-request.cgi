#!/usr/bin/env python2.7
# Python script for displaying information from HTTP request

# [lyn, 2017/08/28]

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

  inputKeys = sorted(inputs.keys())
  timestamp = datetime.datetime.now()
  timestring = timestamp.strftime("%Y-%m-%d-%H-%M-%S-%f")

  if 'jsonData' not in inputKeys:
    print 'Failure: no key jsonData'
  else: 
    jsonData = inputs.getvalue('jsonData')
    copyrightDict = json.loads(jsonData)
    if 'ArtId' in copyrightDict: 
      artId = copyrightDict['ArtId']
      outFileName = 'paper{}_request__{}'.format(artId, timestring)
    else: 
      outFileName = 'unknownPaper_request__{}'.format(timestring)
    with open (os.path.join(outputdir, outFileName), 'w') as outFile:
      outFile.write(jsonData)
    print jsonData # Return string of dictionary

# Guido's suggested method for CGI debugging 
def main():
  print "Content-Type: text/plain\n"
  try:
    # Invoke the page request handler
    respondToPageRequest()
  except:
    print "<hr><h1>A Python Error occurred!</h1>"
    cgi.print_exception()

# Start the whole shebang
main()

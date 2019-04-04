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

  inputKeys = inputs.keys()
  inputDict = {key:inputs.getvalue(key) for key in inputKeys}
  timestamp = datetime.datetime.now()
  timestring = timestamp.strftime("%Y-%m-%d-%H-%M-%S-%f")

  if 'ArtId' not in inputKeys:
    outFileName = 'unknownPaper_confirm__{}'.format(timestring)
    print 'Failure'
  else: 
    artId = inputs.getvalue('ArtId')
    outFileName = 'paper{}_confirm__{}'.format(artId, timestring)
    print 'Success'

  with open (os.path.join(outputdir, outFileName), 'w') as outFile:
    json.dump(inputDict, outFile)

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

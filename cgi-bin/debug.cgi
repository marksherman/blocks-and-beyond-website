#!/usr/bin/env python2.6
# Python script for displaying information from HTTP request

import cgi, os
import cgitb; cgitb.enable()
import types

# Top-level dispatch for web page request from this site
def respondToPageRequest():

  print "Welcome to the cgi-bin debugging page.<br>"
  print "This page displays key-value pairs from the HTTP request, plus all environment variables.<br>"

  # Extract CGI form fields
  inputs = cgi.FieldStorage()

  # Display keys 
  print("<br><b>Keys:</b><br>" + str(inputs.keys()))
  sortedKeys = sorted(inputs.keys())
  print("<br><br><b>Sorted Keys</b><br>" + str(sortedKeys))

  # Display key-value pairs
  print("<br><br><b>Key-value pairs:</b><br>")
  for key in sortedKeys:
    value = inputs.getvalue(key)
    if isinstance(value, list): # value can be list for checkbox or radio group
      print("{k}: {v}<br>".format(k=key,v=str(value))) # use str to convert list to string
    else: 
      print("{k}: {v}<br>".format(k=key,v=value)) # here value is already a string
  
  # Display environment variables
  print "<br><b>Environment variables:</b><br>"
  for param in os.environ.keys():
    print "<i>%20s</i>: %s<br>" % (param,os.environ[param])

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

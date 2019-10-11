#!/bin/sh
#
#  Purpuse : Send a xml request to the endpoint.
#. Argumment
#.      - name of the xml file with the request message.
# -----------------------------------------------------------------------------
# 1.0  11-10-2019  Jeroen de Jong
#      Creatie
# ----------------------------------------------------------------------------

xmlrequestfile=$1
endpoint='http://speeltuin-drupal8.localhost/services/access_soap_module/soap/endpoint'

if [ "${xmlrequestfile}" == "" ] 
then 
    printf "Error: argument 1 was not provided. \n"
    exit
fi

xmlrequestfile=$1
endpoint='http://speeltuin-drupal8.localhost/services/access_soap_module/soap/endpoint'

printf "Submitted the following xml to the endpoint ${endpoint}: \n\n"
cat $xmlrequestfile
printf "\n\nAnd recieved: \n\n"

curl --header "content-type: text/soap+xml; charset=utf-8" --data @${xmlrequestfile} -k  $endpoint

printf "\n\n"
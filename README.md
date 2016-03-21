# XOvis

The objective of this project is to gain insights into how XOs are used in
Nepalese classrooms. In order to learn about XO usage, first data is collected
from their Journal backups on the schoolserver. Subsequently, the data is
processed and imported into a database and finally visualized using fancy
interactive charts. The application that implements the visualization of the
data is called XOvis, a Couch App built using [Kanso](htttp://kan.so)
framework. See dataflow.svg for a schematic representation of the entire
workflow.

## Installation

#### Install manually

* Install project dependencies

		yum install python-pip git couchdb nodejs npm

* Clone this repository in the destination of your choice

		git clone https://github.com/andi-g/xovis.git

* Install angular, couchapp, d3 by issuing the following command
    in the root directory of this repo.

        cd xovis
		npm install 

* If you haven't already, start your couchdb instance on your machine and 
    push the xovis couchapp into a existing database

		cd xovis # assuming you are still in the root directory of the repo
		../node_modules/.bin/couchapp push app.js http://localhost:5984/<your_couchdb>
    If you have already set up a couchdb admin user, please use its credentials:

        ../node_modules/.bin/couchapp push app.js http://username:password@localhost:5984/<your_couchdb>

    If you are installing into a new database you need to create the database first:

        curl -X PUT http://andi:aidA1941@localhost:5984/xovis

	where `xovis` is the name of the new database.


### Load existing deployment data into the database

* Insert XO Journal backup data into the same database using a Python script

		pip install -r requirements.txt
		./process_stats/process_journal_stats.py dbinsert xovis --deployment <deployment-name>
		
	*Note:*

	The script can also output statistical data to a file instead of inserting it
	into a database. To produce all statistical data from the Journal, one row per
	Journal record, call:
	
		process_journal_stats.py all
	
	To extract statistical data about the use of activities on the system, use:
	
		process_journal_stats.py activity
	
	To learn about all options of the script, see:
	
		process_journal_stats.py --help

* To manage Couch databases using a browser dashboard, go to

		http://localhost:5984/_utils

## Visualize

* Open up a browser and open the index.html file in this repo. 

**Enjoy the beautiful view!**

## Acknowledgments

`process_journal_stats.py` script is based on
[olpc-journal-processor](https://github.com/Leotis/olpc_journal_processor)
script Leotis' Buchanan and
[get-journal-stats](http://gitorious.paraguayeduca.org/get-journal-stats) by
Raul Gutierrez Segales.

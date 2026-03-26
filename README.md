# ChainLetters (Working Title)

This is the development code-base for my personal project, ChainLetters (one of many working titles) -- a desktop (for now) app on which users create, write and submit stories, which are then sent on for other users to continue and branch off of.
Currently, the entire app is in development mode. I have used this project as a chance to keep my pre-existing Python / SQL skills sharp, and expand my knowledge of HTML / CSS / Javascrip, in particular JS-React.

The "stack" (such as it is):
- PostgreSQL database (currently hosted on my own laptop, and managed via PGAdmin4) consisting of base tables and supporting views
- Accessed by a Django (Python) ORM and backend, which includes a Django-Rest-Framework API layer
- Passed to a HTML / CSS / Javascript-React frontend, either via basic views or API endpoints.

## General Coding Comments

### Potential Employers
If you're here because of a link from a job application -- thank you for having a look at my code! The repository is a bit bloated right now, but essentially 90% of the coding goes on in just a couple of the folders:
- chainletters/chainlettersstories/ for Python, including
  -  models.py for ORM,
  -   views.py for manipulating database outputs to be passed to the frontend,
  -   tests.py for creating a bulk-random-population of the database across all objects;
- chainletters/frontend/ for JS-React.

For Postgres, I've created the supporting file
- chainletters/database_reference_material, which contains
  - full_ERD.png, an image of the entity relationship diagram of the database which I designed and built,
  - schema_explanation.txt, a guide to the schema in words as the ERD isn't the clearest,
  - views_backup.sql, the SQL code I used to create the database's permanent views.
    - see E.G. segment_trace for a complex recursive query.

### Omissions and Oversights
This is a personal project and first and foremost a learning exercise, and as such I've prioritised trying things out and learning concepts over "business-ready" best practice. However, including/demonstrating use of some of these practices is my next priority. These include:
- Testing: While I have tested the code as I've gone, this hasn't been particularly rigorous. My next objective is to add some unit-testing and go from there (ideally integrating with GitHub).
- Authentification: Simply haven't got around to learning about this, but I'm keen to find a good entry-level framework for understanding authentification and then implement it.
- Comments: I've favoured a "comments-lite" approach since it's just me working on this for now, but at some point I will go through and ensure the code is sufficiently well-documented to be understood.

### Use of AI
I've tried to avoid using AI too much during this exercise, as I worry it would get in the way of learning anything. That said, a couple of times I have resorted to it are as follows:
- serializers.py: I find Django's approach to serialization quite counterintuitive, and have struggled to follow the documentation, so I've frequently usd AI to debug my failed Serializer classes. (It usually tells me to rename "related_name" in a completely unexpected place in models.py.)
- setting up Django with React: the online guide I followed intructed me to do this via a Vite plugin. It also set up hot-module-replacement of my .jsx files. This was all super useful for development, but a complete pain to set up -- in particular dealing with how Django / React pass static files around -- which I then made worse by turning to AI to resolve issues. (This is in part why the repo is so bloated / why there are so many folders pertaining to static files.)
- general consultation: If I can't find a solution to my React issue on Reddit or StackOverflow, I'm not above asking ChatGPT every now and then, although I try not to overdo it, and I never copy any code across.


### Use of GitHub
In spite of this being a solo project, I've still made use of GitHub's branch feature. I've made a couple of abortive attempts to get into its "Issues" and other features, but I think these feel pretty untenable out of a group setting.
In previous versions, this is where I'd explain key branches where different versions of the app were present; more recently though I've decided to consolidate into main, as I was only really using one branch the whole time anyway. 



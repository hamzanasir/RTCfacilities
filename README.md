# RTC Facilities

This is a Ruby 5.1.4 application that will be used to administer and manage temperature requests for IIT buildings. It uses a SQlite 3 database in development mode and a Postgres database in production.

## Setup

To get setup with the application first clone it onto your own machine and run `bundle install --without production`. Once you install the required gems run this command:

```shell
rails db:migrate
```

This will create the tables necessary for your development database. There are three main tables that will be created for you.

1. buildings
2. rooms
3. complaints

Next to save you the hassle of manually inserting buildings, rooms and creating their relevant associations we are going to run the rails `seeds.rb` file which parses all of the SVG's for availablle maps and adds this information into the database. To do that run this command:

```shell
rails db:seed
```

Finally run:

```shell
rails server
```
And you should have the server running on localhost:3000.

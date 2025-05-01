# Project Name
CarPals: Where Commuting Meets Community

# Team Name
Team 14

# Team Members
- Edwin Tran (GitHub: [@edwintran235])
- Macy Graves (GitHub: [@megraves])
- Lauren Shea (GitHub: [@laurensheaa])
- Sofia Simonoff (GitHub: [@ssim31])

# Brief Overview of the Application
Carpals is an easy-to-use platform that connects commuters in need of a ride with drivers who have available seats. The app aims to foster a sense of community, sustainability, and safety by reducing traffic, lowering commuting costs, helping the environment, and benefiting the economy. It allows users to carpool based on routes, schedules, and preferences, with riders contributing to gas costs. Drivers earn rewards, and users can rate and review rides, building a trusted network for regular carpools.

# How to run the project:
Our project is set up as a handful of microservices that communicate. 
To run each of the services, we must first build each docker image (NOTE: replace service-name with the name of the service):
``bash
cd .\microservices\service-name
docker build -t service-name:latest .
``

After this is done for each of the services, we can run docker compose from the microservices directory to run the services simultaneously (NOTE: replace service-name with the name of the service):
``bash
cd .\microservices
docker compose up
``

They can also be ran individually by running this script in each service directory (NOTE: it is important that the registry is run first):
``bash
docker run --name service-name -d --rm --network palnet service-name:latest
``

To stop and remove the microservices, press ctrl+c and:
``bash
docker compose down
``

# UI/UX Design and Style Guidelines Document
[Link to document: ](https://docs.google.com/document/d/1jewEByGbgYzrDl6XzVTZxdZ3uMgZQSFG5pJnXJYFSW0/edit?tab=t.0)



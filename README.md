# pathfinder-challenge
Submit your own pathfinding algorithm in Python and watch it work!

[Live Demo](https://hummushacks.github.io/pathfinder)

My goal for this project was to learn about pathfinding algorithms
and visualization. Additionally, I wanted to provide others with
a way to learn about pathfinding without having to create a visualizer.

The backend is a Flask app which accepts a Python file submission.
It runs the pathfinding algorithm to validate its correctness and
then sends back data for the frontend to visualize the results.

## Usage
First navigate to the backend directory.

You can run locally with Python:
```
pip3 install -r requirements3.txt
python3 app.py
```

or build and run with Docker:
```
docker build --tag pathf .
PORT=8080 && docker run -p 9090:${PORT} -e PORT=${PORT} --detach --name pf pathf
```

The frontend currently submits to my Google Cloud Run container.
To run locally, replace the form submission in
[pathfinder.html](https://github.com/BStarcheus/pathfinder-challenge/blob/523133ccb1fca705ca48a5cb5f96818633a3902a/frontend/pathfinder.html#L34)
to the proper localhost port (8080 for Python, 9090 for Docker).
import sys

class Node:
    def __init__(self, id, cost=1, wall=False):
        """
        Node of a graph
        :param id:       Unique identifier for the Node (immutable obj)
        :param cost:     The cost of going to this Node (used in pathfinding)
        :param wall:     True if the position is a wall (cannot be occupied).
        """
        self.id = id
        self.cost = cost
        self.totalCost = sys.maxsize
        self.priority = sys.maxsize
        self.prevNode = None
        self.wall = wall
        self.adjacent = []

    def __lt__(self, other):
        return self.priority < other.priority

    def __gt__(self, other):
        return self.priority > other.priority

    def __le__(self, other):
        return self.priority <= other.priority

    def __ge__(self, other):
        return self.priority >= other.priority

    def __str__(self):
        return str(self.id)

    def __repr__(self):
        return self.__str__()


class Graph:
    def __init__(self, nodes={}):
        """
        Create an undirected graph structure with Nodes
        :param nodes: A dictionary with 
                         keys: node id, 
                         values: Node object
        """
        self.nodes = nodes

    def add_edge(self, node1, node2):
        """
        :param node1: Node object to add connection to
        :param node2: Node object to add connection to
        """
        if node1.id not in self.nodes:
            self.nodes[node1.id] = node1
        self.nodes[node1.id].adjacent.append(node2)

        if node2.id not in self.nodes:
            self.nodes[node2.id] = node2
        self.nodes[node2.id].adjacent.append(node1)


    def neighbors(self, node_id):
        """
        Get the neighbors of a Node with a given id
        :param node_id: The identifier of the Node
        :return:        List of adjacent nodes that are not walls
        """
        if node_id not in self.nodes: return None
        
        return [node for node in self.nodes[node_id].adjacent if node.wall == False]

    def __getitem__(self, id):
        return self.nodes[id]



def trace_path(startNode, endNode):
    """
    Used in pathfinding algorithms to trace the path from 
    the end node back to start.
    :param startNode: Start node of the path
    :param endNode:   Target node with a prevNode value to trace backward
    :return:          List of nodes representing a path from start to end
    """
    if endNode is None: 
        return []

    current = endNode 
    path = []

    while current.id != startNode.id:
        path.append(current.id)
        current = current.prevNode
        
    path.append(startNode.id)
    path.reverse()

    return path



class GridGraph(Graph):
    def __init__(self, height=20, width=20):
        self.height = height
        self.width = width
        adj_list = self.generate_grid(height=height, width=width)
        super().__init__(adj_list)

    def add_walls(self, walls):
        """
        :param walls: List of node ids to make walls
        """
        for wall in walls:
            self.nodes[wall].wall = True

    @staticmethod
    def generate_grid(height=20, width=20):
        """
        Create a graph of a grid, with each point being adjacent to
        the vertically and horizontally adjacent points. 
        :param height: Vertical height of the grid
        :param width:  Horizonal width of the grid
        :return:       Dict of points on a standard grid
        """
        points = { x:Node(x, 1) for x in [f'{i},{j}' for i in range(height) for j in range(width)] }

        for point in points:
            i, j = point.split(',')
            i, j = int(i), int(j)

            if i != 0:
                points[point].adjacent.append(points[f'{i-1},{j}'])
            if i != height-1:
                points[point].adjacent.append(points[f'{i+1},{j}'])
            if j != 0:
                points[point].adjacent.append(points[f'{i},{j-1}'])
            if j != width-1:
                points[point].adjacent.append(points[f'{i},{j+1}'])

        return points

    @staticmethod
    def heuristic(node1, node2):
        """
        Get the Manhattan distance between two points of a grid
        :param node1: Node object with id 'x,y'
        :param node2: Node object with id 'x,y'
        :return:      Integer Manhattan distance value
        """
        x1, y1 = node1.id.split(',')
        x1, y1 = int(x1), int(y1)
        x2, y2, = node2.id.split(',')
        x2, y2 = int(x2), int(y2)
        return abs(x1 - x2) + abs(y1 - y2)
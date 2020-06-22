from graph import *
import heapq

def astar(graph, startNode, endNode, heuristic):
    """
    Search for a path using A* Algorithm.
    Graph must have nodes with a cost attribute.
    :param graph:     Graph object to be searched for a path
    :param startNode: Node object to start search at
    :param endNode:   Node object being searched for
    :param heuristic: Heuristic function to find distance to end node
                      Parameters: startNode, endNode
    :return:          List with 2 lists: 
                      List of all checked nodes (coordinate strings)
                      List of path nodes. If no path, None
    """
    pq = [] # Priority Queue
    checked_order = [] # Order that spots were checked, for visual

    startNode.totalCost = startNode.cost
    heapq.heappush(pq, startNode)

    while pq:
        current = heapq.heappop(pq)

        if current.id not in checked_order:
            checked_order.append(current.id)

        if current.id == endNode.id:
            return [checked_order, trace_path(startNode, current)]
        
        for neighbor in graph.neighbors(current.id):
            newTotalCost = current.totalCost + neighbor.cost
            
            if newTotalCost < neighbor.totalCost:
                neighbor.prevNode = current
                neighbor.totalCost = newTotalCost
                neighbor.priority = newTotalCost + heuristic(neighbor, endNode)
                heapq.heappush(pq, neighbor)

    # No path found
    return [checked_order, trace_path(startNode, None)]


def dijkstras(graph, startNode, endNode):
    """
    Search for a path using Dijksta's Algorithm.
    Graph must have nodes with a cost attribute.
    :param graph:     Graph object to be searched for a path
    :param startNode: Node object to start search at
    :param endNode:   Node object being searched for
    :return:          List with 2 lists: 
                      List of all checked nodes (coordinate strings)
                      List of path nodes. If no path, None
    """
    pq = [] # Priority Queue
    checked_order = [] # Order that spots were checked, for visual

    startNode.totalCost = startNode.cost
    heapq.heappush(pq, startNode)

    while pq:
        current = heapq.heappop(pq)

        if current.id not in checked_order:
            checked_order.append(current.id)

        if current.id == endNode.id:
            return [checked_order, trace_path(startNode, current)]
        
        for neighbor in graph.neighbors(current.id):
            newTotalCost = current.totalCost + neighbor.cost
            
            if newTotalCost < neighbor.totalCost:
                neighbor.prevNode = current
                neighbor.totalCost = newTotalCost
                # Priority is used for comparison in heapq
                neighbor.priority = newTotalCost
                heapq.heappush(pq, neighbor)

    # No path found
    return [checked_order, trace_path(startNode, None)]

import os
import copy
import importlib
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from werkzeug.utils import secure_filename
from board import *
from algorithm_collection import astar

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route('/', methods=["POST"])
@cross_origin()
def upload_file():
    if request.method == "POST":
        if 'pyFile' not in request.files:
            return jsonify({"error":"No file submitted"})
        file = request.files['pyFile']
        if file.filename == '':
            return jsonify({"error":"No selected file"})
        if file and request.files["pyFile"].mimetype == "text/x-python-script":
            filename = secure_filename(file.filename)
            file.save(filename)
            mod, _ = filename.rsplit('.py', 1)
            
            try:
                return jsonify(run_pathfinder_test(mod))
            except Exception as e:
                print(e)
                return jsonify({"error":f"Internal error"})
        else:
            return jsonify({"error":"Invalid file type."})


def run_pathfinder_test(module_name, num_boards=3):
    """
    Test a user's pathfinding algorithm function with several 
    random grid configurations. 
    :param module_name: Name of file uploaded by user
    :param num_boards: Number of random boards to test with
    :return: List of result dicts for each board tested
    """

    user_pathfinder = importlib.import_module(module_name)

    if hasattr(user_pathfinder, 'pathfinder'):

        boards = [Board() for _ in range(num_boards)]
        
        # Create backups in case user alters graph
        validation_boards = []
        for i in range(num_boards):
            validation_boards.append(copy.copy(boards[i]))

        # List of result data to be sent back to client
        results = []
        num_correct = 0

        for i in range(num_boards):
            user_board = boards[i]
            valid_board = validation_boards[i]

            result = {}
            result['board_height'] = user_board.height
            result['board_width'] = user_board.width
            result['start'] = user_board.start
            result['end'] = user_board.end
            result['walls'] = []
            for id in user_board.nodes:
                if user_board[id].wall == True:
                    result['walls'].append(id)


            result_list = user_pathfinder.pathfinder(user_board, user_board[user_board.start], user_board[user_board.end])
            result['user_checked_spaces'] = result_list[0]
            result['user_path'] = result_list[1]
            result['user_path_length'] = len(result_list[1])
            validate_algorithm(valid_board, result)
            if result['user_path_valid'] == True:
                num_correct += 1
            results.append(result)

        if num_correct == num_boards:
            results[-1]['msg'] += f"You found the hummus all {num_boards} times!\n"
            results[-1]['msg'] += "Clue: You're too early. Wait until all 3 challenges have been created, then try again."

        return results
    else:
        return {"error":"Could not find your 'pathfinder' function."}



def validate_algorithm(board, result):
    """
    Validate the user's algorithm against A*. Any path is valid if
    it starts and ends in correct spaces, and doesn't go through walls.
    :param board:  Board object with randomized config
    :param result: The result dict, which will return data about the validation
    """
    
    correct_result_list = astar(board, board[board.start], board[board.end], GridGraph.heuristic)

    valid_path = True
    msg = ""
    
    # Start and end in proper spots
    if len(result['user_path']) and (result['user_path'][0] != board.start or result['user_path'][-1] != board.end):
        valid_path = False
        msg += "Invalid path: Start or End was not in the path\n"
    
    for i in range(len(result['user_path']) - 1):
        # Don't jump spaces or go diagonal
        if not any(result['user_path'][i+1] == x.id for x in board.neighbors(result['user_path'][i])):
            valid_path = False
            msg += "Invalid path: Moved between non-adjacent spaces\n"
            break
        # Don't go through walls
        if board[result['user_path'][i]].wall:
            valid_path = False
            msg += "Invalid path: Went through a wall space\n"
            break

    result['user_path_valid'] = valid_path
    if valid_path:
        if len(result['user_path']) < len(correct_result_list[1]):
            msg += "Your path was shorter than the minimum path length. That shouldn't be possible.\n"
        elif len(result['user_path']) == len(correct_result_list[1]):
            msg += "Congrats, you got the path in minimum moves!\n"
        else:
            msg += "Great job! You found a path.\n"

    result['msg'] = msg

    result['correct_checked_spaces'] = correct_result_list[0]
    result['correct_path'] = correct_result_list[1]
    result['min_path_length'] = len(correct_result_list[1])



if __name__ == "__main__":
    app.run(debug=True,host='0.0.0.0',port=int(os.environ.get('PORT', 8080)))
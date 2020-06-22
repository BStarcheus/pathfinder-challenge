from graph import *
import random
import copy


class Board(GridGraph):
    def __init__(self, start=None, end=None, height=20, width=20, wall_coverage=0.3):
        """
        :param start:         Start point string, format 'x,y'
        :param end:           End point string, format 'x,y'
        :param height:        Number of rows in board
        :param width:         Number of columns in board
        :param wall_coverage: Proportion of board spaces with walls
        """
        super().__init__(height, width)

        random.seed()
        self.wall_coverage = wall_coverage
        self.start = start
        self.end = end

        if self.start is None:
            self.start = self.find_random_empty_space()
        if self.end is None:
            self.end = self.find_random_empty_space()
        
        self._generate_board()


    def _generate_board(self):
        num_walls = int(self.height * self.width * self.wall_coverage)

        for _ in range(num_walls):
            node = self.find_random_empty_space()
            self.nodes[node].wall = True


    def find_random_empty_space(self):
        row = random.randrange(0, self.height)
        col = random.randrange(0, self.width)

        while ( self.nodes[f'{row},{col}'].wall or
                f'{row},{col}' == self.start or
                f'{row},{col}' == self.end ):
            row = random.randrange(0, self.height)
            col = random.randrange(0, self.width)

        return f'{row},{col}'

    def __copy__(self):
        b = Board(start=self.start, end=self.end, height=self.height, width=self.width, wall_coverage=self.wall_coverage)
        for id in self.nodes:
                b[id].wall = self[id].wall
        return b

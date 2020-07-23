import Queue from './Queue'

const findNeighbours = (current, grid, visited) => {
    var neigh = [];
    var x = current.x
    var y = current.y
    if (x + 1 < 10 && grid[x + 1][y] !== 1 && visited[x + 1][y] !== 1) {
        neigh.push({ x: x + 1, y: y })
        // console.log(visited[x + 1][y])
    }

    if (y + 1 < 10 && grid[x][y + 1] !== 1 && visited[x][y + 1] !== 1) {
        neigh.push({ x: x, y: y + 1 })
        // console.log(visited[x][y + 1])
    }

    if (x - 1 >= 0 && grid[x - 1][y] !== 1 && visited[x - 1][y] !== 1) {
        neigh.push({ x: x - 1, y: y })
        // console.log(visited[x - 1][y])
    }

    if (y - 1 >= 0 && grid[x][y - 1] !== 1 && visited[x][y - 1] !== 1) {
        neigh.push({ x: x, y: y - 1 })
        // console.log(visited[x][y - 1])
    }

    return neigh;
}
export const bfs = (grid, start) => {
    var queue = new Queue()
    var visited = Array(10).fill().map(() => Array(10).fill(0))
    var parentOf = {}
    var path = []
    var traversed_path = []
    queue.enqueue(start)
    while (!queue.isEmpty()) {
        var current = queue.dequeue()

        if (grid[current.x][current.y] === 3) {
            console.log("Found")
            let temp = Object.assign({}, current)

            while (grid[temp.x][temp.y] !== 2) {
                // console.log(temp);
                temp = parentOf[JSON.stringify(temp)]
                path.push(temp)
            }
            path.pop()
            traversed_path = traversed_path.filter((point) => {
                return (point.x !== current['x'] || point.y !== current['y'])
            })
            break;
        }

        visited[current.x][current.y] = 1
        // var visited = visited.map(function (arr) {
            // return arr.slice();
        //   });
        // console.log(visited)
        var neighbours = findNeighbours(current, grid, visited)
        // console.log(current.x+" "+current.y)
        // console.log(neighbours)
        
        traversed_path.push(...neighbours)
        for (var i = 0; i < neighbours.length; i++) {
            parentOf[JSON.stringify(neighbours[i])] = Object.assign({}, current)
            queue.enqueue(neighbours[i])
            visited[neighbours[i].x][neighbours[i].y] = 1
        }
    }
    // traversed_path.pop()
    return [path, traversed_path]
    // console.log("Not found")
}

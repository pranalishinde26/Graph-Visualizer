# 🚀 Graph Visualizer

An interactive **Graph Visualization Tool** built using HTML, CSS, and JavaScript.

This project visually demonstrates how graph algorithms work using:

✨ Breadth First Search (BFS)  
✨ Depth First Search (DFS)  
✨ Adjacency Matrix Representation  
✨ Weighted Undirected Graphs  
✨ Real-time Canvas Animation  

---

## 🎯 Project Overview

This application uses the **HTML Canvas API** to render and animate a graph structure.

Users can:

🔹 Drag nodes dynamically  
🔹 Add weighted edges  
🔹 Remove edges  
🔹 Run BFS traversal  
🔹 Run DFS traversal  
🔹 View live adjacency matrix updates  
🔹 Reset the graph to default topology  

---

## 🧠 Core Features

### 🎨 Interactive Graph Canvas
- Draggable nodes
- Dynamic edge positioning
- Weighted edge labels
- Neon glow traversal effects
- Smooth animation

---

### 🌊 BFS (Breadth First Search)
- Starts from node 0
- Queue-based traversal
- Level-by-level exploration
- Step-by-step animation
- Live status updates

---

### 🌳 DFS (Depth First Search)
- Starts from node 0
- Recursive traversal
- Depth-first exploration
- Animated highlighting

---

### 📊 Adjacency Matrix
- Dynamically generated table
- `0` represents no edge
- Displays edge weights
- Highlights visited connections
- Synced with traversal animation

---

### 🛠 Edge Controls
- Add edge between two nodes
- Assign custom weight
- Remove edges
- Input validation included

---

### 🔄 Reset Function
- Restores default node layout
- Restores original adjacency matrix
- Stops running animations

---

## 🧩 Technologies Used

- 🏗 HTML5
- 🎨 CSS3 (Glass UI + Neon Theme)
- ⚙ Vanilla JavaScript
- 🖌 HTML Canvas API

---

## 📂 Graph Representation

Internally, the graph is represented using:

- An array of node objects storing `(x, y)` positions
- A 2D adjacency matrix storing edge weights

Example structure:
matrix[u][v] = weight
matrix[v][u] = weight


✔ Undirected  
✔ Weighted  

---

## 🔍 Traversal Logic

### 🔵 BFS Algorithm
- Uses a queue
- Marks nodes as visited
- Explores neighbors level-by-level

### 🟣 DFS Algorithm
- Uses recursion
- Explores as deep as possible before backtracking

Traversal animation is handled using timed intervals for visual clarity.

---

## ▶ How to Run

1. Clone or download the repository
2. Open `index.html` in your browser
3. Start interacting with the graph 🚀

No installation required.

---

## 🎓 Learning Outcomes

This project demonstrates:

✔ Graph Data Structures  
✔ Adjacency Matrix Representation  
✔ BFS & DFS Algorithms  
✔ Canvas Rendering  
✔ DOM Manipulation  
✔ Event Handling  
✔ Animation using `requestAnimationFrame`  

---

## 👩‍💻 Author

**Pranali Shinde**  
Second Year Engineering Student  
Passionate about Data Structures & Visualization 💙  

---

## 🔮 Future Improvements

- ✨ Dijkstra’s Algorithm
- ➡ Directed Graph Mode
- ➕ Add / Remove Nodes dynamically
- 🌗 Dark / Light Theme Toggle
- 📱 Advanced Mobile Optimization

---

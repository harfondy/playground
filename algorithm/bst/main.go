package main

import "fmt"

type Tree struct {
	Left   *Tree
	Right  *Tree
	Parent *Tree
	Value  int
}

var tree *Tree

func insert(num int, node *Tree) *Tree {
	if node == nil {
		return &Tree{
			Value:  num,
			Parent: nil,
			Left:   nil,
			Right:  nil,
		}
	} else if num > node.Value {
		if node.Right == nil {
			node.Right = &Tree{
				Value:  num,
				Parent: node,
				Left:   nil,
				Right:  nil,
			}
		} else {
			insert(num, node.Right)
		}
	} else if num < node.Value {
		if node.Left == nil {
			node.Left = &Tree{
				Value:  num,
				Parent: node,
				Left:   nil,
				Right:  nil,
			}
		} else {
			insert(num, node.Left)
		}
	} else {
		fmt.Println("number has been added in the tree, no same number allowed, num: ", num)
	}

	return node
}

func searchDFS(num int, tree *Tree, d int) (found bool, depth int) {
	if d == 0 {
		d = 1
	}
	if tree == nil {
		return false, 0
	} else if tree.Value == num {
		return true, d
	} else if tree.Value < num {
		return searchDFS(num, tree.Right, d+1)
	} else if tree.Value > num {
		return searchDFS(num, tree.Left, d+1)
	}
	return false, 0
}

func findMinReplaceValue(tree *Tree) *Tree {
	n := tree.Right
	for n != nil && n.Left != nil {
		n = n.Left
	}
	return n
}

func deleteNode(num int, tree *Tree) *Tree {
	if tree == nil {
		return tree
	} else if tree.Value < num {
		tree.Right = deleteNode(num, tree.Right)
	} else if tree.Value > num {
		tree.Left = deleteNode(num, tree.Left)
	} else {
		if tree.Left == nil && tree.Right == nil {
			return nil
		} else if tree.Left == nil { // case only has right child
			return tree.Right
		} else if tree.Right == nil { // case only has left child
			return tree.Left
		} else { // case has both child, find minimum replace value, 1st right, and loop to left
			nodeReplace := findMinReplaceValue(tree)
			tree.Value = nodeReplace.Value
			tree.Right = deleteNode(nodeReplace.Value, tree.Right)
		}
	}
	return tree
}

func print(t *Tree) {
	if t == nil {
		return
	}

	print(t.Left)
	fmt.Printf("%d ", t.Value)
	print(t.Right)
}

func main() {
	arrInput := []int{10, 5, 11, 2, 1, 3, 20, 9, 12}

	for i := 0; i < len(arrInput); i++ {
		tree = insert(arrInput[i], tree)
	}

	print(tree)
	fmt.Println("")

	for i := 0; i < len(arrInput); i++ {
		f, d := searchDFS(arrInput[i], tree, 0)
		fmt.Printf("%v, %d: %d\n", f, d, arrInput[i])
	}

	tree = deleteNode(10, tree)
	print(tree)
	fmt.Println("")

	for i := 0; i < len(arrInput); i++ {
		f, d := searchDFS(arrInput[i], tree, 0)
		fmt.Printf("%v, %d: %d\n", f, d, arrInput[i])
	}
}

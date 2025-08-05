package main

import "fmt"

type Node struct {
	Prev  *Node
	Next  *Node
	Key   int
	Value int
}

type LRUCache struct {
	Capacity int
	Cache    map[int]*Node
	Head     *Node
	Tail     *Node
}

func (r *LRUCache) remove(n *Node) {
	prevNode := n.Prev
	nextNode := n.Next

	prevNode.Next = nextNode
	nextNode.Prev = prevNode
}

func (r *LRUCache) add(key int, value int) {
	if r.Cache[key] != nil {
		n := r.Cache[key]

		n.Prev.Next = n.Next
		n.Next.Prev = n.Prev

		n.Next = r.Head.Next
		n.Prev = r.Head
	} else {

		if len(r.Cache) >= r.Capacity {
			// remove tail
			r.remove(r.Tail.Prev)
			delete(r.Cache, key)
		}

		n := &Node{
			Key:   key,
			Value: value,
			Prev:  r.Head,
			Next:  r.Head.Next,
		}
		r.Head.Next.Prev = n
		r.Head.Next = n
		r.Cache[key] = n
	}
}

func (r *LRUCache) printData() {
	n := r.Head
	fmt.Println("------")
	for n != r.Tail {
		fmt.Println("Data key: ", n.Key, ", val: ", n.Value)
		n = n.Next
	}
	fmt.Println("Data key: ", r.Tail.Key, ", val: ", r.Tail.Value)
	fmt.Println("------")
}

func NewLRUCache(capacity int) *LRUCache {
	headNode := &Node{Key: 0, Value: 0}
	tailNode := &Node{Key: 0, Value: 0}
	headNode.Prev = tailNode
	headNode.Next = tailNode
	tailNode.Next = headNode
	tailNode.Prev = headNode

	return &LRUCache{
		Capacity: capacity,
		Cache:    map[int]*Node{},
		Head:     headNode,
		Tail:     tailNode,
	}
}

func main() {

	c := NewLRUCache(5)

	c.add(1, 1)
	c.printData()
	c.add(2, 2)
	c.printData()
	c.add(3, 2)
	c.add(4, 2)
	c.add(5, 2)
	c.add(6, 2)
	c.printData()
}

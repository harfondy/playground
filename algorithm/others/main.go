package main

import (
	"fmt"
)

func calcMaxNoAdjacent(arrInput []int) int {

	if len(arrInput) == 0 {
		return 0
	}

	if len(arrInput) == 1 {
		return arrInput[0]
	}

	// since we are not allowed adjacent addition

	var prev1 = arrInput[0]
	var prev2 = max(arrInput[0], arrInput[1]) // find the max between array 0 and 1 first

	for i := 2; i < len(arrInput); i++ {
		// the loop is checking the max value between prev2 (or imaginary in the middle)
		// then compare it between prev1 + arrayInput[i] (or imaginary prev1 idx 0 & arrayInput idx 2)

		// next cycle will repeat the same procedure with increment idx + 1
		current := max(prev2, prev1+arrInput[i])
		prev1 = prev2   // setting prev1 as prev2 (first value)
		prev2 = current // setting prev2 as current (the best addition in the mid position)
	}

	return prev2
}

func max(a int, b int) int {
	if a < b {
		return b
	}
	return a
}

func main() {
	fmt.Println(calcMaxNoAdjacent([]int{1, 2, 3, 1}))
	fmt.Println(calcMaxNoAdjacent([]int{5, 1, 1, 5, 1}))
	fmt.Println(calcMaxNoAdjacent([]int{99, 100, 98}))
	fmt.Println(calcMaxNoAdjacent([]int{1, 100, 2}))
	fmt.Println(calcMaxNoAdjacent([]int{1, 2, 3, 4, 5, 6, 7, 8, 9}))
}

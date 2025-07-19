package main

import (
	"fmt"
	"math/rand"
	"time"

	alg "sorting/alg" // local package [current package]/[package]
)

func generateRandomNumber(n int) []int {
	var result []int
	for range n {
		result = append(result, rand.Intn(n)+1)
	}
	return result
}

func main() {
	rand.New(rand.NewSource((time.Now().UnixNano())))
	const n = 100

	var arr []int = generateRandomNumber(n)
	var startTime time.Time

	arrCase := append([]int{}, arr...)
	startTime = time.Now()

	fmt.Println("Case: ", arrCase)
	fmt.Printf("[BubbleSort] Start Time: %v\n", startTime)
	alg.BubbleSort(arrCase, alg.SortTypeASC)
	fmt.Printf("[BubbleSort] End Time: %v, Duration: %v\n", time.Now(), time.Since(startTime))
	fmt.Println("Result: ", arrCase)

	fmt.Printf("\n\n")

	arrCase = append([]int{}, arr...)
	startTime = time.Now()

	fmt.Println("Case: ", arrCase)
	fmt.Printf("[MergeSort] Start Time: %v\n", startTime)
	alg.MergeSort(arrCase, alg.SortTypeASC)
	fmt.Printf("[MergeSort] End Time: %v, Duration: %v\n", time.Now(), time.Since(startTime))
	fmt.Println("Result: ", arrCase)
}

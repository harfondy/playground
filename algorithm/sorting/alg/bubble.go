package alg

// Bubble Sort
func BubbleSort(arr []int, sortType SortType) {
	var (
		temp        int
		isPosChange bool
	)

	for i := 0; i < len(arr); i++ {
		for j := i; j < len(arr); j++ {
			isPosChange = false

			if sortType == SortTypeASC {
				if arr[i] > arr[j] {
					temp = arr[i]
					isPosChange = true
				}
			} else {
				if arr[i] < arr[j] {
					temp = arr[i]
					isPosChange = true
				}
			}

			if isPosChange {
				arr[i] = arr[j]
				arr[j] = temp
			}
		}
	}
}

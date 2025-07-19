package alg

func mergeSortMerge(arr []int, left int, mid int, right int, sortType SortType) {
	var temp []int

	i := left
	j := mid + 1

	for i <= mid && j <= right { // [x, y, a, b] [x, y] && [a, b] both start from left to have right order
		if sortType == SortTypeASC {
			if arr[i] < arr[j] {
				temp = append(temp, arr[i])
				i++
			} else {
				temp = append(temp, arr[j])
				j++
			}
		} else {
			if arr[i] > arr[j] {
				temp = append(temp, arr[i])
				i++
			} else {
				temp = append(temp, arr[j])
				j++
			}
		}
	}

	for i <= mid { // append the rest of the array from left - mid
		temp = append(temp, arr[i])
		i++
	}

	for j <= right { // append the rest of the array from mid+1 - right
		temp = append(temp, arr[j])
		j++
	}

	for i = left; i <= right; i++ { // change array input value
		arr[i] = temp[i-left]
	}
}

func mergeSortFunc(arr []int, left int, right int, sortType SortType) {
	if left >= right {
		return
	}

	var mid int = (left + right) / 2

	mergeSortFunc(arr, left, mid, sortType)
	mergeSortFunc(arr, mid+1, right, sortType)
	mergeSortMerge(arr, left, mid, right, sortType)
}

func MergeSort(arr []int, sortType SortType) {
	mergeSortFunc(arr, 0, len(arr)-1, sortType)
}

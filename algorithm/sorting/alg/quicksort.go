package alg

func partition(arr []int, low int, high int, sortType SortType) int {

	pivot := arr[high]

	var i = low
	for j := low; j <= high-1; j++ {
		if sortType == SortyTypeDESC {
			if arr[j] >= pivot {
				temp := arr[j]
				arr[j] = arr[i]
				arr[i] = temp
				i++
			}
		} else {
			if arr[j] <= pivot {
				temp := arr[j]
				arr[j] = arr[i]
				arr[i] = temp
				i++
			}
		}
	}

	temp := arr[i]
	arr[i] = arr[high]
	arr[high] = temp
	return i
}

func quickSort(arr []int, low int, high int, sortType SortType) {
	if low >= high || low < 0 {
		return
	}

	p := partition(arr, low, high, sortType)

	quickSort(arr, low, p-1, sortType)
	quickSort(arr, p+1, high, sortType)

}

func QuickSort(arr []int, sortType SortType) {
	switch sortType {
	case SortyTypeDESC:
		break
	default:
		sortType = SortTypeASC
	}

	quickSort(arr, 0, len(arr)-1, sortType)
}

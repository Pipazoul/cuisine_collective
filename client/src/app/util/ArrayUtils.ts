export class ArrayUtils {

    public static compareSortedArrays(array1, array2) {
        if(Array.isArray(array1) && Array.isArray(array2)){
            return array1.length === array2.length && array1.every((value, index) => value === array2[index]);
        }
        else {
            throw new Error("One of the parameters is not an Array.");
        }
    }
}
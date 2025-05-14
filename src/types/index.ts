export interface Image {
  blob: string
  name: string
  timeStamp: string
  fileData: FileSystemFileEntry
}

type EXIFCordinate = [D: number, M: number, S: number]
type EXIFCordinateEmpty = [D: null, M: null, S: null]

export interface EXIFType {
  GPSLatitude?: EXIFCordinate | EXIFCordinateEmpty
  GPSLatitudeRef?: null | 'N' | 'S'
  GPSLongitude?: EXIFCordinate | EXIFCordinateEmpty
  GPSLongitudeRef?: null | 'E' | 'W'
}

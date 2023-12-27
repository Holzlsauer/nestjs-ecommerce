class ListProductDetailsDTO {
  name: string;
  description: string;
}

class ListProductImagesDTO {
  url: string;
  description: string;
}

export class ListProductDTO {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly details: ListProductDetailsDTO[],
    readonly images: ListProductImagesDTO[],
  ) { }
}

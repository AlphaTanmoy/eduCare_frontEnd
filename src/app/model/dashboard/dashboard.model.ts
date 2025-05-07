export class DashboardSlideshowImage {
  fileId!: string;
  fileStream!: any;

  constructor(fileId: string, url: any) {
    this.fileId = fileId;
    this.fileStream = url;
  }
}

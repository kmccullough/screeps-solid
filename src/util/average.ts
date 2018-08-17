export class MeanAverage {

  constructor(
    protected mean: number = 0,
    protected nSamples: number = 0,
  ) {

  }

  add(...samples: number[]) {
    samples.forEach(sample =>
      this.mean = this.mean
        + (sample - this.mean) / ++this.nSamples
    );
    return this;
  }

  value() {
    return this.mean;
  }

}

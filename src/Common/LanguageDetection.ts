const { FastText, addOnPostRun } = require('browser-fasttext.js');

export class LanguageDetection {
    private static _fastText: any;
    private static _model: any;
    private static _modelFileName: string = "model.bin";

    public static detect(value: string): Promise<string> {
        return LanguageDetection.init().then(() => {
            const result = LanguageDetection._model.predict(value);
            const predictions: Array<any> = [];
            for (let i = 0; i < result.size(); i++) {
                const prediction = result.get(i);
                predictions.push({ score: prediction[0], label: prediction[1] });
            }
            predictions.sort(function (a: any, b: any) { return b.score - a.score; });
            return predictions[0].label.substring("__label__".length);
        });
    }

    public static init(): Promise<void> {
        return new Promise(resolve => {
            if (LanguageDetection._fastText && LanguageDetection._model) {
                return resolve();
            }

            addOnPostRun(() => {
                if (!LanguageDetection._fastText) {
                    this.prepareFastText();
                }

                if (!LanguageDetection._model) {
                    this.prepareTextModel(resolve);
                }
            });
        });
    }

    private static prepareFastText() {
        LanguageDetection._fastText = new FastText();
    }

    private static prepareTextModel(resolve: any) {
        LanguageDetection._fastText.loadModel(LanguageDetection._modelFileName).then((model: any) => {
            if (!LanguageDetection._model) {
                LanguageDetection._model = model;
            }
            return resolve();
        });
    }
}

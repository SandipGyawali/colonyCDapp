declare namespace StepColonyNameCssNamespace {
  export interface IStepColonyNameCss {
    buttons: string;
    iconContainer: string;
    main: string;
    mappings: string;
    nameForm: string;
    names: string;
    paragraph: string;
    query700: string;
    reminder: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    tooltipContent: string;
    version: string;
  }
}

declare const StepColonyNameCssModule: StepColonyNameCssNamespace.IStepColonyNameCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StepColonyNameCssNamespace.IStepColonyNameCss;
};

export = StepColonyNameCssModule;
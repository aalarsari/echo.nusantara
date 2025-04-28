declare module "react-quill" {
  import * as React from "react";

  export interface QuillProps {
    value?: string;
    onChange?: (value: string) => void;
    theme?: string;
    placeholder?: string;
    modules?: object;
    formats?: string[];
    readOnly?: boolean;
  }

  export default class ReactQuill extends React.Component<QuillProps> {}
}

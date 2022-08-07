import { WidgetContent } from "./widget-content-model";

export interface Widget {
    id: number,
    title: string,
    content: WidgetContent[]
}
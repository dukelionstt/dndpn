import { Location } from "./location.model";

export interface Tag{
  id: number;
  name: string;
  type: string;
  locations: Location[];
}

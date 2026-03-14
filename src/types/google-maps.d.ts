declare namespace google.maps.places {
  class Autocomplete {
    constructor(
      input: HTMLInputElement,
      opts?: AutocompleteOptions
    );
    addListener(event: string, handler: () => void): void;
    getPlace(): PlaceResult;
  }

  interface AutocompleteOptions {
    types?: string[];
    fields?: string[];
  }

  interface PlaceResult {
    geometry?: {
      location?: {
        lat(): number;
        lng(): number;
      };
    };
    name?: string;
    formatted_address?: string;
  }
}

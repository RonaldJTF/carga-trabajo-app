export class Url {
    static extractPathAndParams(urlString): {path: string, queryParams: any} {
    const [path, query] = urlString.split('?');
    const queryParams = query ? query.split('&').reduce((params, param) => {
      const [key, value] = param.split('=');
      params[key] = value;
      return params;
    }, {}) : {};

    return {
      path,
      queryParams
    };
  }
}
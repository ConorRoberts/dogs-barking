import { APP_NAME } from "~/config/config";

const constructRouteTitle = (title: string) => {
  return `${title} - ${APP_NAME}`;
};

export default constructRouteTitle;

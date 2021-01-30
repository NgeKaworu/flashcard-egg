import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router, middleware } = app;

  router.post('/record/create', middleware.isLogin, controller.record.create);
  // router.delete('/record/remove', controller.record.remove);
  // router.put('/record/update', controller.record.update);
  // router.get('/record/list', controller.record.list);
};

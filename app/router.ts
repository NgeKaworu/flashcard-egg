import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.post('/record/create', controller.record.create);
  router.delete('/record/remove/:id', controller.record.remove);
  router.put('/record/update', controller.record.update);
  router.get('/record/list', controller.record.list);
};

export default (fn:any) => {
  return (req:any, res:any, next:any) => {
    // fn(req, res, next).catch((err) => next(err));
    fn(req, res, next).catch(next);
  };
};

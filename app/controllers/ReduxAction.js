// export const reduxAdd = reduxIndex => (
//     {
//       type: 'SET_TOKEN',
//       payload: reduxIndex,
//     }
//   );

const reduxAdd = reduxIndex => (
  {
    type: 'SET_TOKEN',
    payload: reduxIndex,
  }
);

const setPage = reduxIndex => (
  {
    type: 'SET_PAGE',
    payload: reduxIndex,
  }
);

export {reduxAdd, setPage};
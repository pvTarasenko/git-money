import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './crudIncomeListModal.module.scss';
import modalCrudOperationsClosed from '../../../redux/actions/modalWindow/closeModalWindowCrudCategory';
import { motion, AnimatePresence } from 'framer-motion';
import transferBStoresStarted from '../../../redux/actions/transferBetweenStores/transferBStoresStarted';
import incomes from '../../../img/incomes';
import editNameAction from '../../../redux/actions/crud/editNameCategory';
import editIconAction from '../../../redux/actions/crud/editIconCategory';
import { MoveDirection } from 'react-particles-js';
import modalWindowCrudCategoryOpened from '../../../redux/actions/modalWindow/openModalWindowCrudCategory';
const backdrop = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};
const modal = {
  hidden: {
    x: '-50%',
    y: '-50%',
    scale: 0.1,
    opacity: 0,
  },
  visible: {
    x: '-50%',
    y: '-50%',
    scale: 1,
    opacity: 1,
    transition: { delay: 0.2, duration: 0.3 },
  },
};
function ModalWindowCrudCategory({ show }) {
  const dispatch = useDispatch();
  const userId = useSelector(state => state.user._id);
  const modalConfiguration = useSelector(state => state.isCrudModalWindow);
  const type = modalConfiguration.type;
  const subtype = modalConfiguration.subtype;
  const id = modalConfiguration.id;
  const idStoreTo = modalConfiguration.idStoreTo;
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [currentId, setCurrentId] = useState('');
  const [chosenIcon, setChosenIcon] = useState(0);
  const listOfStoreCategories = useSelector(state =>
    state.categories.filter(category => {
      return category.value === 'store';
    })
  );
  let nameOfTheCategoryTo = '';
  nameOfTheCategoryTo = useSelector(state =>
    state.categories.filter(category => {
      return category.id === idStoreTo;
    })
  );
  const nameOfTheCurrentCategory = useSelector(state =>
    state.categories.filter(category => {
      return category.id === id;
    })
  );

  console.log(listOfStoreCategories);
  return (
    <AnimatePresence exitBeforeEnter>
      {show ? (
        <>
          <motion.div
            className={styles.backdrop}
            onClick={() => {
              setName('');
              dispatch(modalCrudOperationsClosed());
              setError('');
            }}
            variants={backdrop}
            initial="hidden"
            animate="visible"
          />
          <motion.div
            className={styles.modalMain}
            variants={modal}
            initial="hidden"
            animate="visible"
          >
            {type === 'store' && subtype === 'editName' ? (
              <>
                <h3 className={styles.modalHeader}>Изменить название</h3>
                <p className={styles.modalSubheader}>
                  Введите новое название хранилища
                </p>
                <input
                  type="text"
                  id="name"
                  placeholder={'Название'}
                  value={name}
                  onChange={event => setName(event.target.value)}
                  className={styles.input}
                />
                {error && <p className={styles.modalSubheader}>{error}</p>}
                <button
                  className={styles.addButton}
                  onClick={() => {
                    if (name !== '') {
                      if (name.length < 20) {
                        dispatch(editNameAction(userId, id, name));
                        dispatch(modalCrudOperationsClosed());
                        setName('');
                        setError('');
                      } else {
                        setError('Название не может быть больше 20 символов');
                      }
                    } else {
                      setError('Название не может быть пустым');
                    }
                  }}
                >
                  Изменить
                </button>
              </>
            ) : (
              <></>
            )}
            {type === 'store' && subtype === 'editIcon' ? (
              <>
                <h3 className={styles.modalHeader}>
                  Изменить иконку хранилища
                </h3>
                <p
                  className={styles.modalSubheader}
                  style={{ flexBasis: '100%' }}
                >
                  Выберите иконку:
                </p>
                <div className={styles.iconRow}>
                  {incomes.map((icon, index) => (
                    <motion.button
                      onClick={() => setChosenIcon(index)}
                      whileTap={{ scale: 1.05 }}
                      className={
                        index === chosenIcon
                          ? styles.chosenIcon
                          : styles.iconOption
                      }
                    >
                      {icon}
                    </motion.button>
                  ))}
                </div>
                <button
                  className={styles.addButton}
                  onClick={() => {
                    dispatch(editIconAction(userId, id, chosenIcon));
                    dispatch(modalCrudOperationsClosed());
                  }}
                >
                  Изменить
                </button>
              </>
            ) : (
              <></>
            )}

            {type === 'store' && subtype == 'transferStarted' ? (
              <>
                <h3 className={styles.modalHeader}>
                  Перевод средств в другую категорию
                </h3>
                <p
                  className={styles.modalSubheader}
                  style={{ flexBasis: '100%' }}
                >
                  Выберите, куда перевести средства
                </p>
                <div className={styles.iconRow}>
                  {listOfStoreCategories.map(category => {
                    return category.id !== id ? (
                      <motion.button
                        className={styles.iconOption}
                        onClick={() => {
                          dispatch(
                            modalWindowCrudCategoryOpened(
                              'store',
                              'transferInProgress',
                              id,
                              category.id
                            )
                          );
                        }}
                      >
                        <div
                          style={{ display: 'flex', flexDirection: 'column' }}
                        >
                          <div> {incomes[category.iconId]} </div>
                          <div>
                            <strong> {category.name}</strong>
                          </div>
                          <div> {category.currentNumber}</div>
                        </div>
                      </motion.button>
                    ) : (
                      <></>
                    );
                  })}
                </div>
                <button
                  className={styles.addButton}
                  onClick={() => {
                    dispatch(modalCrudOperationsClosed());
                  }}
                >
                  Выбрать
                </button>
              </>
            ) : (
              <></>
            )}
            {type === 'store' && subtype === 'transferInProgress' ? (
              <>
                <h3 className={styles.modalHeader}>Укажите сумму перевода</h3>
                <p
                  className={styles.modalSubheader}
                  style={{ flexBasis: '100%' }}
                >
                  Из {nameOfTheCurrentCategory[0].name} в{' '}
                  {nameOfTheCategoryTo[0].name}
                </p>
                <input
                  type="number"
                  id="name"
                  placeholder={'3000'}
                  value={name}
                  onChange={event => setName(event.target.value)}
                  className={styles.input}
                />
                {error && <p className={styles.modalSubheader}>{error}</p>}

                <button
                  className={styles.addButton}
                  onClick={() => {
                    if (name > 0) {
                      dispatch(
                        transferBStoresStarted(
                          userId,
                          nameOfTheCategoryTo[0].id,
                          nameOfTheCurrentCategory[0].id,
                          Number(name)
                        )
                      );
                      dispatch(modalCrudOperationsClosed());
                      setError('');
                    } else {
                      setError('Вы не можете перевести меньше 0$');
                    }
                  }}
                >
                  Перевести
                </button>
              </>
            ) : (
              <></>
            )}
          </motion.div>
        </>
      ) : (
        <></>
      )}
    </AnimatePresence>
  );
}

export default ModalWindowCrudCategory;

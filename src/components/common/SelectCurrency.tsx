
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/configureStore';
import IconChevronDown from '../../icons/IconChevronDown';
import { listCurrency } from '../../constants';
import classNames from '../../utils/classNames';
import { setCurrency } from '../../store/currency/currencySlice';

const SelectCurrency = () => {
    const dispatch = useDispatch();
    const currency = useSelector((state: RootState) => state.currency);
    console.log("currency - ", currency);
    return (
      <div className="font-medium cursor-pointer relative group">
        <div className="text-xs md:text-sm flex items-center gap-1">
          <p>{listCurrency.find((item) => item.key === currency)?.title}</p>
          <span>
            <IconChevronDown />
          </span>
        </div>
        <div className="absolute z-50 right-0 top-[calc(100%+1rem)] invisible opacity-0 group-hover:visible group-hover:opacity-100 group-hover:top-full transition-all duration-300">
          <div className="p-4 mt-3 rounded-md shadow-xl bg-white space-y-2 flex flex-col text-black">
            {listCurrency.map((item) => (
              <div
                onClick={() => {
                  dispatch(setCurrency(item.key));
                  setTimeout(() => window.location.reload(), 250);
                }}
                className={classNames(
                  "text-xs md:text-sm hover:text-primary transition-all duration-200",
                  item.key === currency ? "text-primary" : "text-icon-color"
                )}
              >
                {item.title}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
}

export default SelectCurrency
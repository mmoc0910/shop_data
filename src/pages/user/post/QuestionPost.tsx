import { Collapse, CollapseProps } from "antd";
import img1 from "../../../assets/question-post/img.jpg";
import img2 from "../../../assets/question-post/img2.jpg";
import img3 from "../../../assets/question-post/img3.jpg";
import img4 from "../../../assets/question-post/img4.jpg";
import img5 from "../../../assets/question-post/img5.jpg";

const items: CollapseProps["items"] = [
  {
    key: "1",
    label: (
      <p className="font-primary font-medium text-base">
        1. Can not download APP?
      </p>
    ),
    children: (
      <ul>
        <li className="font-primary text-base">- Use alternated link</li>
        <li className="font-primary text-base">
          - Use 4G and 4G hotspot to download it instead of Wifi
        </li>
      </ul>
    ),
  },
  {
    key: "2",
    label: (
      <p className="font-primary font-medium text-base">
        2. Add key not successful
      </p>
    ),
    children: (
      <div>
        <p className="font-primary text-base">
          - Ensure you did copy corrected full key format included of{" "}
          <span className="text-primary20">ssconf://</span>
          or <span className="text-primary20">ss://</span>
        </p>
        <img className="w-full md:w-[350px] h-auto my-3" src={img1} />
        <p className="text-base font-primary">
          Corrected copy:{" "}
          <span className="text-primary20">
            ssconf://s3.ap-northeast-3.amazonaws.com/vpncn2.top/20240317-trial03d-touy-reyj.json#trial03d-touy-240317-1
          </span>
        </p>
        <img className="w-full md:w-[350px] h-auto my-3" src={img2} />
        <p
          className="font-primary text-base 
        mb-2"
        >
          Not Corrected: (no <span className="text-error">ssconf://</span> at
          the beginning){" "}
          <span className="text-error">
            gist.githubusercontent.com/vpncn2/883db21ccd5cbd42da/raw/012-vpncn2key.txt#h-chinavip-temporary
          </span>
        </p>
        <p className="font-primary text-base">
          If you do corrected copy the key format but still doesn’t work with
          notice: <span className="text-error">“Invalid access key ”</span>,
          please update OUTLINE software to newest version, or contact ADMIN or
          support to get instruction.
        </p>
        <img className="w-full md:w-[350px] h-auto my-3" src={img3} />
      </div>
    ),
  },
  {
    key: "3",
    label: (
      <p className="font-primary font-medium text-base">
        3. The key works well on phone but doesn’t work on PC
      </p>
    ),
    children: (
      <ul>
        <li className="font-primary text-base">
          1. Ensure your PC had un-install all other VPN software (like v2ray,
          softvpn, ethervpn, litevpn, …)
        </li>
        <li className="font-primary text-base">
          2. Ensure your proxy setting is disabled
        </li>
        <li className="font-primary text-base">
          3. After then Restart PC and start install OUTLINE again
        </li>
        <li className="font-primary text-base">
          4. If still trouble please contact admin for support directly. You may
          need have Ultraview install on your PC. Link download Ultraviewer
        </li>
      </ul>
    ),
  },
  {
    key: "4",
    label: (
      <p className="font-primary font-medium text-base">
        4. Install Outline on PC but failed with the message{" "}
        <span className="text-error">
          “sorry we could not configure your system to connect to outline”
        </span>
      </p>
    ),
    children: (
      <div className="">
        <p className="text-base font-primary mb-2">
          Install Outline VPN on Windows PC (normally it happen with windows 11
          version) and get this error.
        </p>
        <p className="text-base font-primary mb-2">
          Then when connect outline, it shows error:
        </p>
        <p className="text-base font-primary mb-2">
          “Failed to download server configuration. Screenshot the error details
          and send them to your access key provider ”
        </p>
        <img className="w-full md:w-[400px] h-auto my-3" src={img4} />
        <p className="font-semibold text-base font-primary">Fix:</p>
        <ul>
          <li>
            <p className="text-base font-primary">
              1. After the "failed" installation, go to control panel and
              manually rename the TAP device to “outline-tap0”
            </p>{" "}
            <img className="w-full md:w-[400px] h-auto my-3" src={img5} />
          </li>
          <li className="text-base font-primary">
            2. Run the installer again to force re-install Outline (No need
            uninstall).
          </li>
          <li className="text-base font-primary">
            3. Re-enter your server info (or the ssconf:// link) in the Outline
            App and connect.
          </li>
          <li className="text-base font-primary">4. Now everything should work properly.</li>
        </ul>
      </div>
      // <ul>
      //   <li className="font-primary text-base">
      //     1. Ensure your PC had un-install all other VPN software (like v2ray,
      //     softvpn, ethervpn, litevpn, …)
      //   </li>
      //   <li className="font-primary text-base">
      //     2. Ensure your proxy setting is disabled
      //   </li>
      //   <li className="font-primary text-base">
      //     3. After then Restart PC and start install OUTLINE again
      //   </li>
      //   <li className="font-primary text-base">
      //     4. If still trouble please contact admin for support directly. You may
      //     need have Ultraview install on your PC. Link download Ultraviewer
      //   </li>
      // </ul>
    ),
  },
];
const QuestionPost = () => {
  return (
    <div>
      <Collapse items={items} defaultActiveKey={["1"]} />
    </div>
  );
};

export default QuestionPost;

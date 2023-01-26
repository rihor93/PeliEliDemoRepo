import { Button, Form } from 'antd';


interface TelegramButtonProps {
    value: string,
    onClick(): void
}

const TelegramButton: React.FC<TelegramButtonProps> = (props) => {
  return (
    <>
      <Form
        labelCol={{ span: 6 }}
        name="basic"
        layout="horizontal"

        autoComplete="off"
      >
        <Form.Item>
          <Button
            block
            type="primary"
            onClick={props.onClick}
          >
            {props.value}
          </Button>
        </Form.Item>
      </Form>
      
    </>
  );
};
export default TelegramButton;

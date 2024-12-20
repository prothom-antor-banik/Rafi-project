import React, { useEffect, useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Initial } from "../../redux/slice/productSlice";
import { createProduct } from "../../redux/thunk/productThunk";
import AdminHeader from "../../components/AdminHeader";
import Message from "../../components/Message";
import Loader from "../../components/Loader";

function CreatProductPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.product);
  const { current_user } = useSelector((state) => state.user);

  const initialState = {
    name: "",
    description: "",
    price: 0,
    image: "",
    brand: "",
    category: "",
    countInStock: 0,
  };

  const [state, setState] = useState(initialState);
  const [buttonPressed, setButtonPressd] = useState(false);

  const handleSubmit = async () => {
    const formData = new FormData();

    if (state.image) {
      formData.append("image", state.image);
    }
    formData.append("name", state.name);
    formData.append("description", state.description);
    formData.append("price", Number(state.price));
    formData.append("brand", state.brand);
    formData.append("category", state.category);
    formData.append("countInStock", Number(state.countInStock));
    formData.append("rating", Math.round(Math.random() * 5));

    dispatch(createProduct(formData));
    setButtonPressd(true);
  };

  useEffect(() => {
    if (buttonPressed) {
      setTimeout(() => {
        if (success) {
          dispatch(Initial());
          setState(initialState);
        }
      }, 1000);
    }
    return () => {
      if (success) dispatch(Initial());
    };
  }, [success, buttonPressed]);

  if (!Object.keys(current_user).length) return <Navigate to="/login" />;
  else if (!current_user.is_superuser) return <Navigate to="/" />;
  else {
    return (
      <div className="d-flex flex-column min-vh-100">
        <AdminHeader />
        <Row className="justify-content-center px-5 py-3">
          <section className="py-3 d-flex flex-row justify-content-between align-items-center">
            <h1>Create Product</h1>
            <span>
              <Button
                variant="dark"
                size="lg"
                onClick={() => navigate("/admin/products")}
              >
                Products
              </Button>
            </span>
          </section>
          <Col md={6}>
            <Form onSubmit={(e) => e.preventDefault()}>
              <Form.Group className="p-2" controlId="name">
                <Form.Label className="fw-bold">Name</Form.Label>
                <Form.Control
                  type="name"
                  placeholder="Enter name"
                  value={state.name}
                  onChange={(e) => setState({ ...state, name: e.target.value })}
                ></Form.Control>
              </Form.Group>

              <Form.Group className="p-2" controlId="price">
                <Form.Label className="fw-bold">Price</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter price"
                  value={state.price}
                  onChange={(e) =>
                    setState({ ...state, price: e.target.value })
                  }
                ></Form.Control>
              </Form.Group>

              <Form.Group className="p-2" controlId="brand">
                <Form.Label className="fw-bold">Brand</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter brand"
                  value={state.brand}
                  onChange={(e) =>
                    setState({ ...state, brand: e.target.value })
                  }
                ></Form.Control>
              </Form.Group>

              <Form.Group className="p-2" controlId="countinstock">
                <Form.Label className="fw-bold">Stock</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter stock"
                  value={state.countInStock}
                  onChange={(e) =>
                    setState({ ...state, countInStock: e.target.value })
                  }
                ></Form.Control>
              </Form.Group>

              <Form.Group className="p-2" controlId="category">
                <Form.Label className="fw-bold">Category</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter category"
                  value={state.category}
                  onChange={(e) =>
                    setState({ ...state, category: e.target.value })
                  }
                ></Form.Control>
              </Form.Group>
            </Form>
          </Col>
          <Col md={6}>
            <Form onSubmit={(e) => e.preventDefault()}>
              <Form.Group className="p-2" controlId="image">
                <Form.Label className="fw-bold">Image</Form.Label>
                <Form.Control
                  type="file"
                  placeholder="Enter image"
                  onChange={(e) =>
                    setState({ ...state, image: e.target.files[0] })
                  }
                ></Form.Control>
              </Form.Group>
              <Form.Group className="p-2" controlId="description">
                <Form.Label className="fw-bold">Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  placeholder="Enter description"
                  value={state.description}
                  onChange={(e) =>
                    setState({ ...state, description: e.target.value })
                  }
                ></Form.Control>
              </Form.Group>
            </Form>
          </Col>
          {error ? (
            <div className="pt-2">
              <Message
                variant={"danger"}
                message={"Could not create product"}
              />
            </div>
          ) : loading ? (
            <Loader />
          ) : success ? (
            <div className="pt-2">
              <Message
                variant={"success"}
                message={"Successfully created product"}
              />
            </div>
          ) : (
            <></>
          )}
          <center className="py-3">
            <Button onClick={() => handleSubmit()} type="submit" variant="dark">
              Create
            </Button>
          </center>
        </Row>
      </div>
    );
  }
}

export default CreatProductPage;
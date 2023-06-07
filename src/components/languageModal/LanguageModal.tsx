import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { useAuth } from "../../context/AuthProvider";
import supabase from "../../config/supabaseClient";

interface LanguageModalProps {
  show: boolean;
  handleClose: () => void;
  language: { label: string; value: string };
}

type SelectOptionType = { label: string; value: string };

const LanguageModal: React.FC<LanguageModalProps> = ({
  show,
  handleClose,
  language,
}) => {
  const { i18n } = useTranslation();
  const [formError, setFormError] = useState<string | null>(null);
  const { user } = useAuth();
  const [selectedLanguage, setSelectedLanguage] =
    useState<SelectOptionType | null>(null);

  const languageOptions = [
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
  ];

  const handleLanguageChange = async (
    selectedOption: SelectOptionType | null
  ) => {
    setSelectedLanguage(selectedOption);
    if (language) {
      const { data, error } = await supabase
        .from("language")
        .update({ language: selectedOption, userID: user.id })
        .eq("id", user?.id);
      if (error) {
        setFormError("Please fill in all the fields correctly.");
      }
    } else {
      console.log("{ language: selectedOption, userID: user.id }", {
        language: selectedOption,
        userID: user.id,
      });
      const { data, error } = await supabase
        .from("language")
        .insert([{ language: selectedOption, userID: user.id }]);
      if (error) {
        setFormError("Please fill in all the fields correctly.");
      }
    }
  };

  useEffect(() => {
    if (language) {
      setSelectedLanguage(language);
      i18n.changeLanguage(language.value);
    }
  }, [language]);

  const handleSaveChanges = () => {
    if (selectedLanguage) {
      i18n.changeLanguage(selectedLanguage.value);
      handleClose();
    }
  };

  return (
    <Modal show={show} style={{ top: "50%", transform: "translateY(-23%)" }}>
      <Modal.Header>
        <Modal.Title>Please select your language</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="languageSelect">
            <Form.Label>Preferred language</Form.Label>
            <Select
              options={languageOptions}
              value={selectedLanguage}
              onChange={handleLanguageChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        {/* <Button onClick={handleClose}>close</Button> */}
        <ButtonS onClick={handleSaveChanges}>Save Language</ButtonS>
      </Modal.Footer>
    </Modal>
  );
};

export default LanguageModal;

const ButtonS = styled(Button)`
  color: white;
  background: var(--dark);
  border: 2px solid white;
  transition: 0.4s all;
  &:hover {
    border: 2px solid var(--dark);
    background: white;
    color: black;
  }
`;

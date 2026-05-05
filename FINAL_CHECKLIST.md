# Final Submission Checklist - LankaHomeValue

Use this checklist before submitting the project or attending viva. Items marked
as completed were prepared in the final package. Runtime items should still be
checked on the demo laptop before the viva because they depend on MongoDB,
installed dependencies, and running services.

## Project Cleanup

- [x] `node_modules/` removed from `frontend`
- [x] `node_modules/` removed from `backend` if present
- [x] `.venv/` removed if present
- [x] `__pycache__/` removed if present
- [x] temporary build folders removed if present, such as `frontend/dist/`
- [x] real `.env` files excluded from the final ZIP
- [x] `.env.example` is included
- [x] `models/house_price_model.pkl` is included in the final ZIP
- [x] dataset is included in the final ZIP; remove it if your supervisor/university does not allow dataset submission

## Runtime Test

- [ ] FastAPI starts correctly
- [ ] FastAPI health route returns model loaded
- [ ] Express backend starts correctly
- [ ] Express health route returns backend running
- [ ] MongoDB connects successfully
- [ ] React frontend starts correctly
- [ ] Prediction form opens
- [ ] Prediction works
- [ ] Prediction result shows LKR price
- [ ] Prediction category is shown
- [ ] Prediction history saves to MongoDB
- [ ] Delete history works
- [ ] No crashes during demo

## Documentation

- [x] README.md is updated
- [x] DEMO_SCRIPT.md is ready
- [x] VIVA_SHORT_ANSWERS.md is ready
- [x] TESTING.md is ready
- [x] DEPLOYMENT.md is ready
- [ ] Proposal is added to `docs/proposal.docx`
- [ ] Final report is added to `docs/final_report.docx`
- [ ] Presentation is added to `docs/presentation.pptx`

## Screenshots

- [ ] Home page screenshot saved as `screenshots/01-home-page.png`
- [ ] Prediction form screenshot saved as `screenshots/02-prediction-form.png`
- [ ] Prediction result screenshot saved as `screenshots/03-prediction-result.png`
- [ ] Prediction history screenshot saved as `screenshots/04-prediction-history.png`
- [ ] API response screenshot saved as `screenshots/05-api-response.png`
- [ ] Model training output screenshot saved as `screenshots/06-model-training-output.png`

## Viva Preparation

- [x] Can explain project purpose
- [x] Can explain prediction target
- [x] Can explain dataset
- [x] Can explain ML models used
- [x] Can explain best model and R2 score
- [x] Can explain system architecture
- [x] Can explain limitations
- [x] Can explain future improvements
